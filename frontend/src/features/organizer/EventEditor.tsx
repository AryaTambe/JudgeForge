"use client";

import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatePanel } from "@/components/ui/StatePanel";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { FIXTURE_DATA_ENABLED } from "@/lib/api/config";
import { saveEvent, getEvent } from "@/lib/api/portal";
import { addEventPrize, addEventTrack, deleteEventPrize, deleteEventTrack, updateEventPrize, updateEventTrack } from "@/lib/api/organizer";
import type { EventRecord, Prize, Track } from "@/types/portal";

type TrackDraft = { key: string; id?: string; name: string };
type PrizeDraft = { key: string; id?: string; title: string; description: string; amount: string; rank: string };
type EventForm = { name: string; description: string; startDate: string; endDate: string; deadline: string };
interface EventEditorLoad { event: EventRecord | null }
const localValue = (value: string) => { const date = new Date(value); return value && Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 16) : ""; };
const trackRows = (event: EventRecord | null): TrackDraft[] => event?.tracks.map((track, index) => ({ key: `existing-track-${index}`, id: track.id, name: track.name })) ?? [];
const prizeRows = (event: EventRecord | null): PrizeDraft[] => event?.prizes.map((prize, index) => ({ key: `existing-prize-${index}`, id: prize.id, title: prize.title, description: prize.description, amount: prize.amount?.toString() ?? "", rank: prize.rank?.toString() ?? "" })) ?? [];

export function EventEditor({ eventId }: { eventId?: string }) {
  const { token } = useAuth();
  const router = useRouter();
  const load = useCallback(async (): Promise<EventEditorLoad> => {
    if (!token) throw new Error("Your session has expired.");
    return { event: eventId ? await getEvent(eventId, token) : null };
  }, [eventId, token]);
  const resource = useAsyncResource(load);
  const currentEvent = resource.status === "ready" ? resource.data.event : null;
  const defaultForm: EventForm = currentEvent ? { name: currentEvent.name, description: currentEvent.description, startDate: localValue(currentEvent.startDate), endDate: localValue(currentEvent.endDate), deadline: localValue(currentEvent.submissionDeadline) } : { name: "", description: "", startDate: "", endDate: "", deadline: "" };
  const [formDraft, setFormDraft] = useState<EventForm | null>(null);
  const form = formDraft ?? defaultForm;
  const defaultTracks = trackRows(currentEvent);
  const defaultPrizes = prizeRows(currentEvent);
  const [trackDraft, setTrackDraft] = useState<TrackDraft[] | null>(null);
  const [prizeDraft, setPrizeDraft] = useState<PrizeDraft[] | null>(null);
  const tracks = trackDraft ?? defaultTracks;
  const prizes = prizeDraft ?? defaultPrizes;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updateForm<K extends keyof EventForm>(key: K, value: EventForm[K]) { setFormDraft((current) => ({ ...defaultForm, ...current, [key]: value })); }
  function updateTracks(updater: (items: TrackDraft[]) => TrackDraft[]) { setTrackDraft((current) => updater(current ?? defaultTracks)); }
  function updatePrizes(updater: (items: PrizeDraft[]) => PrizeDraft[]) { setPrizeDraft((current) => updater(current ?? defaultPrizes)); }
  function addTrack() { updateTracks((items) => [...items, { key: `new-track-${Date.now()}-${Math.random()}`, name: "" }]); }
  function addPrize() { updatePrizes((items) => [...items, { key: `new-prize-${Date.now()}-${Math.random()}`, title: "", description: "", amount: "", rank: "" }]); }
  async function removeTrack(track: TrackDraft) {
    if (track.id && !FIXTURE_DATA_ENABLED) {
      if (!window.confirm(`Remove track “${track.name}” from the event?`)) return;
      try { if (!token) throw new Error("Session expired."); await deleteEventTrack(token, track.id); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Could not remove this track."); return; }
    }
    updateTracks((items) => items.filter((item) => item.key !== track.key));
  }
  async function removePrize(prize: PrizeDraft) {
    if (prize.id && !FIXTURE_DATA_ENABLED) {
      if (!window.confirm(`Remove prize “${prize.title}” from the event?`)) return;
      try { if (!token) throw new Error("Session expired."); await deleteEventPrize(token, prize.id); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Could not remove this prize."); return; }
    }
    updatePrizes((items) => items.filter((item) => item.key !== prize.key));
  }

  async function submit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      if (!token) throw new Error("Your session has expired.");
      const end = new Date(form.endDate).getTime();
      if (new Date(form.deadline).getTime() > end) throw new Error("Submission deadline cannot be later than the event end date.");
      const savedEvent = await saveEvent(token, { id: eventId, name: form.name.trim(), description: form.description.trim(), start_date: new Date(form.startDate).toISOString(), end_date: new Date(form.endDate).toISOString(), submission_deadline: new Date(form.deadline).toISOString() });
      const savedId = eventId ?? savedEvent.id;
      if (!savedId) throw new Error("The event was saved but the API did not return an event ID, so tracks and prizes could not be associated.");
      const trackResults: TrackDraft[] = [];
      for (const track of tracks) {
        if (!track.name.trim()) continue;
        const saved: Track = track.id ? await updateEventTrack(token, track.id, track.name.trim()) : await addEventTrack(token, savedId, track.name.trim());
        trackResults.push({ key: track.key, id: saved.id, name: saved.name });
      }
      const prizeResults: PrizeDraft[] = [];
      for (const prize of prizes) {
        if (!prize.title.trim()) continue;
        const payload: Omit<Prize, "id"> = { title: prize.title.trim(), description: prize.description.trim(), ...(prize.amount ? { amount: Number(prize.amount) } : {}), ...(prize.rank ? { rank: Number(prize.rank) } : {}) };
        const saved: Prize = prize.id ? await updateEventPrize(token, prize.id, payload) : await addEventPrize(token, savedId, payload);
        prizeResults.push({ key: prize.key, id: saved.id, title: saved.title, description: saved.description, amount: saved.amount?.toString() ?? "", rank: saved.rank?.toString() ?? "" });
      }
      setTrackDraft(trackResults); setPrizeDraft(prizeResults); setFormDraft({ ...form, name: savedEvent.name || form.name });
      setMessage(FIXTURE_DATA_ENABLED ? "Form values were applied in the synthetic UI session. No event mutation was sent to the backend." : "Event, tracks, and prizes were saved from the backend responses.");
      if (!FIXTURE_DATA_ENABLED) router.push("/organizer/events");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save the event configuration."); }
    finally { setBusy(false); }
  }

  return <>
    <FixtureBanner />
    <PageHeader eyebrow={`ORGANIZER / EVENTS / ${eventId ? "EDIT" : "NEW"}`} title={eventId ? "Configure event" : "Create event"} description="Set event timing, then add tracks and prizes. The backend remains authoritative for event status." actions={<Link className="button button--quiet" href="/organizer/events">← Events</Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading event" description="Retrieving current event configuration." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Event unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" ? <>
      {message ? <Notice tone="mint" title="Configuration saved">{message}</Notice> : null}{error ? <div className="form-error" role="alert">{error}</div> : null}
      <form className="event-editor-form" onSubmit={submit}>
        <Panel title="Event details" description="Dates are stored as ISO 8601 timestamps."><div className="form-stack"><label className="field"><span>Event name</span><input required maxLength={160} value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Event name" /></label><label className="field"><span>Description</span><textarea required rows={4} value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Event purpose and submission details" /></label><div className="form-grid-three"><label className="field"><span>Starts</span><input type="datetime-local" required value={form.startDate} onChange={(e) => updateForm("startDate", e.target.value)} /></label><label className="field"><span>Ends</span><input type="datetime-local" required value={form.endDate} onChange={(e) => updateForm("endDate", e.target.value)} /></label><label className="field"><span>Submission deadline</span><input type="datetime-local" required value={form.deadline} onChange={(e) => updateForm("deadline", e.target.value)} /></label></div></div></Panel>
        <Panel title="Tracks" description="Add tracks that participants can select in their project submission." action={<button className="button button--quiet" type="button" onClick={addTrack}>+ Add track</button>}>
          {tracks.length ? <div className="dynamic-rows">{tracks.map((track) => <div className="dynamic-row" key={track.key}><label className="field"><span>Track name</span><input required value={track.name} onChange={(e) => updateTracks((items) => items.map((item) => item.key === track.key ? { ...item, name: e.target.value } : item))} placeholder="Track name" /></label><button className="text-button text-button--danger" type="button" onClick={() => void removeTrack(track)}>Remove</button></div>)}</div> : <div className="empty-inline">No tracks configured. This matches the current DOGFOOD brief; add tracks when the event requires them.</div>}
        </Panel>
        <Panel title="Prizes" description="Record titles, descriptions, and optional amounts/ranks." action={<button className="button button--quiet" type="button" onClick={addPrize}>+ Add prize</button>}>
          {prizes.length ? <div className="dynamic-rows">{prizes.map((prize) => <div className="dynamic-row dynamic-row--prize" key={prize.key}><label className="field"><span>Prize title</span><input required value={prize.title} onChange={(e) => updatePrizes((items) => items.map((item) => item.key === prize.key ? { ...item, title: e.target.value } : item))} /></label><label className="field"><span>Description</span><input value={prize.description} onChange={(e) => updatePrizes((items) => items.map((item) => item.key === prize.key ? { ...item, description: e.target.value } : item))} /></label><label className="field"><span>Amount ($)</span><input type="number" min="0" value={prize.amount} onChange={(e) => updatePrizes((items) => items.map((item) => item.key === prize.key ? { ...item, amount: e.target.value } : item))} /></label><label className="field"><span>Rank</span><input type="number" min="1" value={prize.rank} onChange={(e) => updatePrizes((items) => items.map((item) => item.key === prize.key ? { ...item, rank: e.target.value } : item))} /></label><button className="text-button text-button--danger" type="button" onClick={() => void removePrize(prize)}>Remove</button></div>)}</div> : <div className="empty-inline">No prizes configured.</div>}
        </Panel>
        <div className="form-actions form-actions--end"><Link className="button button--quiet" href="/organizer/events">Cancel</Link><button className="button button--primary" type="submit" disabled={busy}>{busy ? "Saving configuration…" : "Save event configuration →"}</button></div>
      </form>
    </> : null}
  </>;
}
