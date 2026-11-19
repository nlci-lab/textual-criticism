# One witness core plus kind-specific blocks

Every witness file has the same core (id, siglum, aliases, names, kind, date, location, sources, verification) and exactly one kind-specific block: `greek_ms`, `group`, `version`, `father`, and later `ot_ms`. Only the Greek blocks are filled now. This lets versions, fathers and OT witnesses be added without changing existing files or the lookup code, at the cost of a slightly deeper schema than a flat Greek-only one.
