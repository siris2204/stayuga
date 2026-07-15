export function PropertyFilters({
  type,
  city,
  minGuests,
}: {
  type?: string;
  city?: string;
  minGuests?: string;
}) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-4 rounded-2xl border border-line/70 bg-white p-5"
    >
      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">Type</label>
        <select
          name="type"
          defaultValue={type ?? ""}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
        >
          <option value="">All types</option>
          <option value="villa">Villa</option>
          <option value="farmhouse">Farmhouse</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">City</label>
        <input
          type="text"
          name="city"
          defaultValue={city ?? ""}
          placeholder="e.g. Kasauli"
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">Min. guests</label>
        <input
          type="number"
          name="minGuests"
          min={1}
          defaultValue={minGuests ?? ""}
          placeholder="e.g. 10"
          className="w-28 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-forest-light"
      >
        Filter
      </button>
      {(type || city || minGuests) && (
        <a href="/properties" className="text-sm text-ink-soft underline underline-offset-4">
          Clear
        </a>
      )}
    </form>
  );
}
