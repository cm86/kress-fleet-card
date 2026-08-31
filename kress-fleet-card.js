/*
 * Kress Fleet Card for Home Assistant
 *
 * A wrapper around Barma-lej/landroid-card that adds:
 * - mower / live-map view switch
 * - Kress Fleet coverage-period selector
 * - automatic Kress model images with manual-image override
 * - configurable Sections-view grid width
 * - a lightweight visual editor for Kress-specific options
 *
 * Requires the Landroid Card to be installed and loaded.
 *
 * Runtime dependency: Landroid Card by Barma-lej and contributors (MIT).
 * Landroid Card source code and assets are not bundled with this project.
 * See THIRD_PARTY_NOTICES.md in the project repository for attribution.
 * This project is independent and is not affiliated with or endorsed by
 * Barma-lej, Kress, or their respective owners.
 */

const KRESS_FLEET_CARD_VERSION = '0.3.8';
const VIEW_KEY_PREFIX = 'kress-fleet-card-view:';
const LANDROID_TAG = 'landroid-card';
const KRESS_TAG = 'kress-fleet-card';
const EDITOR_TAG = 'kress-fleet-card-editor';


const TEXT = {
  en: {
    mower: 'Mower',
    live_map: 'Live Map',
    coverage: 'Coverage',
    coverage_period: 'Coverage period',
    live_map_unavailable: 'Live Map is not available yet',
    loading: 'Loading Kress Fleet Card …',
    waiting_landroid:
      'Kress Fleet Card is waiting for “Landroid Card”. Install Landroid Card through HACS and make sure its resource is loaded.',
    load_failed: 'Kress Fleet Card could not be loaded',
    automatic: 'Automatic',
    mower_entity: 'Mower entity',
    live_map_camera: 'Live map camera',
    coverage_entity: 'Coverage period',
    target_zone: 'Mowing zone',
    target_zone_entity: 'Mowing zone',
    mow_zone: 'Mow zone',
    mow_zone_button: 'Mow selected zone button',
    select_zone: 'Select a zone',
    default_view: 'Default view',
    sections_width: 'Width in Sections layout',
    width_auto: 'Automatic / Landroid Card',
    width_3: '3 columns',
    width_6: '6 columns',
    width_9: '9 columns',
    width_12: '12 columns (one Section)',
    width_full: 'Full section-area width',
    remember_view: 'Remember last view in this browser',
    max_map_height: 'Maximum map height (px)',
    auto_model_image: 'Automatic Kress model image',
    map_detail_zoom: 'Zoomable map detail (mouse wheel)',
    map_zoom_hint: 'Mouse wheel: zoom · Drag: pan · Double-click: reset',
    map_zoom_reset: 'Reset zoom',
    map_zoom_close: 'Close',
    more_options:
      'Additional Landroid Card options (image, battery card, settings, stats, etc.) remain available in the YAML/code editor.',
    card_description:
      'Kress mower card with switchable mower/live map, coverage period and configurable Sections width.',
  },
  de: {
    mower: 'Mäher',
    live_map: 'Live Map',
    coverage: 'Mähfortschritt',
    coverage_period: 'Coverage-Zeitraum',
    live_map_unavailable: 'Live Map ist noch nicht verfügbar',
    loading: 'Kress Fleet Card lädt …',
    waiting_landroid:
      'Kress Fleet Card wartet auf „Landroid Card“. Bitte Landroid Card über HACS installieren und sicherstellen, dass die Ressource geladen ist.',
    load_failed: 'Kress Fleet Card konnte nicht geladen werden',
    automatic: 'Automatisch',
    mower_entity: 'Mäher-Entity',
    live_map_camera: 'Live-Map-Kamera',
    coverage_entity: 'Coverage-Zeitraum',
    target_zone: 'Mähzone',
    target_zone_entity: 'Mähzone',
    mow_zone: 'Zone mähen',
    mow_zone_button: 'Button „Ausgewählte Zone mähen“',
    select_zone: 'Zone auswählen',
    default_view: 'Standardansicht',
    sections_width: 'Breite im Sections-Layout',
    width_auto: 'Automatisch / Landroid Card',
    width_3: '3 Spalten',
    width_6: '6 Spalten',
    width_9: '9 Spalten',
    width_12: '12 Spalten (eine Section)',
    width_full: 'Volle Breite des Section-Bereichs',
    remember_view: 'Letzte Ansicht in diesem Browser merken',
    max_map_height: 'Maximale Kartenhöhe (px)',
    auto_model_image: 'Kress-Modellbild automatisch laden',
    map_detail_zoom: 'Zoombare Karten-Detailansicht (Mausrad)',
    map_zoom_hint: 'Mausrad: Zoomen · Ziehen: Verschieben · Doppelklick: Zurücksetzen',
    map_zoom_reset: 'Zoom zurücksetzen',
    map_zoom_close: 'Schließen',
    more_options:
      'Weitere Optionen der Landroid Card (Bild, Battery Card, Einstellungen, Statistiken usw.) bleiben im YAML-/Code-Editor verfügbar.',
    card_description:
      'Kress-Mäher-Karte mit umschaltbarer Mäher-/Live-Map-Ansicht, Coverage-Zeitraum und konfigurierbarer Sections-Breite.',
  },
};

const haLanguage = (hass) => {
  const raw =
    hass?.language ||
    hass?.config?.language ||
    (typeof navigator !== 'undefined' ? navigator.language : 'en') ||
    'en';
  return String(raw).toLowerCase().split(/[-_]/)[0];
};

const tr = (hass, key, fallback = key) => {
  const language = haLanguage(hass);
  return TEXT[language]?.[key] ?? TEXT.en[key] ?? fallback;
};

const coverageOptionLabel = (card, option) => {
  const raw = String(option);
  const key = `component.kress_fleet.entity.select.coverage_period.state.${raw}`;
  const translated = card.hass?.localize?.(key);
  if (translated) return translated;

  const language = haLanguage(card.hass);
  const fallback = {
    en: {
      today: 'Today',
      last_2_days: 'Last 2 days',
      last_3_days: 'Last 3 days',
      last_4_days: 'Last 4 days',
      last_5_days: 'Last 5 days',
      last_6_days: 'Last 6 days',
      last_7_days: 'Last 7 days',
    },
    de: {
      today: 'Heute',
      last_2_days: 'Letzte 2 Tage',
      last_3_days: 'Letzte 3 Tage',
      last_4_days: 'Letzte 4 Tage',
      last_5_days: 'Letzte 5 Tage',
      last_6_days: 'Letzte 6 Tage',
      last_7_days: 'Letzte 7 Tage',
    },
  };
  return fallback[language]?.[raw] ?? fallback.en[raw] ?? raw;
};

const registryDeviceId = (card) =>
  card?.hass?.entities?.[card?.config?.entity]?.device_id || null;

const normalizeKressModel = (value) => {
  if (value === undefined || value === null) return null;
  const text = String(value).trim().toUpperCase();
  const match = text.match(/(?:^|[^A-Z0-9])(KR[A-Z0-9]{3,12})(?:$|[^A-Z0-9])/);
  return match?.[1] || null;
};

const resolveMowerModel = (hass, entityId) => {
  if (!hass || !entityId) return null;

  const state = hass.states?.[entityId];
  const registry = hass.entities?.[entityId];
  const device = registry?.device_id ? hass.devices?.[registry.device_id] : null;
  const candidates = [
    device?.model,
    state?.attributes?.model,
    state?.attributes?.model_code,
    state?.attributes?.modelCode,
    state?.attributes?.product_model,
    state?.attributes?.productModel,
  ];

  for (const candidate of candidates) {
    const model = normalizeKressModel(candidate);
    if (model) return model;
  }
  return null;
};

const kressModelImageUrl = (model) =>
  model
    ? `https://static-models.kress-robotik.com/${encodeURIComponent(model)}_256.png`
    : null;

const hasManualMowerImage = (config) => {
  const image = config?.image;
  if (typeof image !== 'string') return Boolean(image);
  const value = image.trim();
  return Boolean(value) && value.toLowerCase() !== 'default';
};

const entityIdsForDevice = (card, domain) => {
  const deviceId = registryDeviceId(card);
  if (!deviceId) return [];

  return Object.values(card.hass?.entities || {})
    .filter((entry) => entry?.device_id === deviceId)
    .map((entry) => entry.entity_id)
    .filter((entityId) => !domain || entityId?.startsWith(`${domain}.`));
};

const resolveMapCamera = (card) => {
  const cfg = card.config || {};
  const explicit = cfg.map_camera || cfg.live_map;
  if (explicit && card.hass?.states?.[explicit]) return explicit;

  const candidates = entityIdsForDevice(card, 'camera');
  return (
    candidates.find((entityId) => {
      const state = card.hass.states[entityId];
      const registry = card.hass.entities?.[entityId];
      if (registry?.translation_key === 'live_map') return true;
      const text = [
        entityId,
        state?.attributes?.friendly_name,
        registry?.name,
        registry?.original_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return (
        text.includes('live map') ||
        text.includes('live_map') ||
        text.includes('live-karte') ||
        text.includes('live karte')
      );
    }) || null
  );
};

const looksLikeCoverageSelect = (card, entityId) => {
  const state = card.hass?.states?.[entityId];
  if (!state) return false;

  const registry = card.hass?.entities?.[entityId];
  if (registry?.translation_key === 'coverage_period') return true;

  const text = [
    entityId,
    state.attributes?.friendly_name,
    registry?.name,
    registry?.original_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (
    text.includes('coverage') ||
    text.includes('zeitraum') ||
    text.includes('coverage_period')
  ) {
    return true;
  }

  const options = state.attributes?.options;
  if (!Array.isArray(options) || options.length < 2) return false;
  const normalized = options.map((option) => String(option).toLowerCase());
  if (
    normalized.includes('today') &&
    normalized.some((option) => /^last_[2-7]_days$/.test(option))
  ) {
    return true;
  }
  // Compatibility with pre-0.3.2 integrations that exposed display strings.
  return (
    normalized.some((option) => option === 'heute' || option === 'today') &&
    normalized.some(
      (option) => option.includes('tage') || option.includes('days'),
    )
  );
};

const resolveCoverageSelect = (card) => {
  const cfg = card.config || {};
  const explicit = cfg.coverage_select || cfg.coverage_entity;
  if (explicit && card.hass?.states?.[explicit]) return explicit;

  return (
    entityIdsForDevice(card, 'select').find((entityId) =>
      looksLikeCoverageSelect(card, entityId),
    ) || null
  );
};

const resolveTargetZoneSelect = (card) => {
  const cfg = card.config || {};
  const explicit = cfg.target_zone_select || cfg.target_zone_entity;
  if (explicit && card.hass?.states?.[explicit]) return explicit;

  const candidates = entityIdsForDevice(card, 'select');
  return (
    candidates.find(
      (entityId) =>
        card.hass?.entities?.[entityId]?.translation_key === 'target_zone',
    ) ||
    candidates.find((entityId) => entityId.endsWith('_target_zone')) ||
    null
  );
};

const resolveMowSelectedZoneButton = (card) => {
  const cfg = card.config || {};
  const explicit = cfg.mow_zone_button || cfg.mow_selected_zone_button;
  if (explicit && card.hass?.states?.[explicit]) return explicit;

  const candidates = entityIdsForDevice(card, 'button');
  return (
    candidates.find(
      (entityId) =>
        card.hass?.entities?.[entityId]?.translation_key === 'mow_selected_zone',
    ) ||
    candidates.find((entityId) => entityId.endsWith('_mow_selected_zone')) ||
    null
  );
};

const resolveStatusSensor = (card) => {
  const candidates = entityIdsForDevice(card, 'sensor');
  return (
    candidates.find(
      (entityId) => card.hass?.entities?.[entityId]?.translation_key === 'status',
    ) ||
    candidates.find((entityId) => entityId.endsWith('_status')) ||
    null
  );
};

const applyLocalizedStatus = (card, statusEntityId) => {
  if (!statusEntityId) return;
  const state = String(card.hass?.states?.[statusEntityId]?.state ?? '').trim();
  if (!state || ['unknown', 'unavailable'].includes(state)) return;

  const key = `component.kress_fleet.entity.sensor.status.state.${state}`;
  const localized = card.hass?.localize?.(key);
  if (!localized || localized === state) return;

  const statusText = card.shadowRoot?.querySelector('.status-text');
  if (!statusText) return;
  const current = String(statusText.textContent ?? '').trim();
  if (!current) return;

  const pattern = new RegExp(`^${escapeRegExp(state)}(?=\\s|$)`, 'i');
  const updated = current.replace(pattern, localized);
  if (updated !== current) {
    statusText.textContent = updated;
    const status = statusText.closest('.status');
    const title = String(status?.title ?? '').trim();
    if (status && title) status.title = title.replace(pattern, localized);
  }
};

const resolveZoneNameSensor = (card) => {
  const cfg = card.config || {};
  const explicit = cfg.zone_name_sensor || cfg.zone_name_entity;
  if (explicit && card.hass?.states?.[explicit]) return explicit;

  const candidates = entityIdsForDevice(card, 'sensor');

  return (
    candidates.find(
      (entityId) => card.hass?.entities?.[entityId]?.translation_key === 'zone_name',
    ) ||
    candidates.find((entityId) => entityId.endsWith('_zone_name')) ||
    candidates.find((entityId) => {
      const state = card.hass?.states?.[entityId];
      const registry = card.hass?.entities?.[entityId];
      const text = [
        entityId,
        state?.attributes?.friendly_name,
        registry?.name,
        registry?.original_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        text.includes('zone name') ||
        text.includes('zone_name') ||
        text.includes('zonenname')
      );
    }) ||
    null
  );
};

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const applyZoneNameToStatus = (card, zoneNameEntityId) => {
  if (!zoneNameEntityId) return;

  const zoneNameState = card.hass?.states?.[zoneNameEntityId];
  const zoneName = String(zoneNameState?.state ?? '').trim();

  if (
    !zoneName ||
    ['unknown', 'unavailable', 'none', 'null'].includes(zoneName.toLowerCase())
  ) {
    return;
  }

  const statusText = card.shadowRoot?.querySelector('.status-text');
  if (!statusText) return;

  const current = String(statusText.textContent ?? '').trim();
  if (!current || !/\bZone\b/i.test(current)) return;

  // First try the mower's current-zone entity so only the actual zone part
  // of the Landroid status line is replaced.
  const currentZoneEntity =
    entityIdsForDevice(card, 'select').find((entityId) => {
      const registry = card.hass?.entities?.[entityId];
      return (
        registry?.translation_key === 'current_zone' ||
        entityId.endsWith('_current_zone')
      );
    }) || null;

  const rawZone = String(
    currentZoneEntity ? card.hass?.states?.[currentZoneEntity]?.state ?? '' : '',
  ).trim();

  let updated = current;

  if (rawZone) {
    const rawPattern = new RegExp(
      `\\bZone\\s+${escapeRegExp(rawZone)}(?:\\s*-\\s*0)?`,
      'i',
    );
    updated = current.replace(rawPattern, zoneName);
  }

  // Compatibility fallback for Landroid Card variants that expose a numeric
  // zone in a slightly different way (for example "Zone 2 - 0").
  if (updated === current) {
    updated = current.replace(
      /\bZone\s+\d+(?:\s*-\s*0)?\b/i,
      zoneName,
    );
  }

  if (updated !== current) {
    statusText.textContent = updated;

    const status = statusText.closest('.status');
    if (status?.title === current || status?.title?.includes('Zone')) {
      status.title = updated;
    }
  }
};

const resolveErrorSensor = (card) => {
  const cfg = card.config || {};
  const explicit = cfg.error_sensor || cfg.error_entity;
  if (explicit && card.hass?.states?.[explicit]) return explicit;

  const candidates = entityIdsForDevice(card);

  return (
    candidates.find((entityId) => {
      const translationKey = card.hass?.entities?.[entityId]?.translation_key;
      return translationKey === 'error' || translationKey === 'error_code';
    }) ||
    candidates.find(
      (entityId) =>
        entityId.endsWith('_error') || entityId.endsWith('_error_code'),
    ) ||
    candidates.find((entityId) => {
      const state = card.hass?.states?.[entityId];
      const registry = card.hass?.entities?.[entityId];

      const text = [
        entityId,
        state?.attributes?.friendly_name,
        registry?.name,
        registry?.original_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        /\berror\b/.test(text) ||
        text.includes('error_code') ||
        text.includes('fehlercode')
      );
    }) ||
    null
  );
};

const resolveErrorDescriptionSensor = (card) => {
  const cfg = card.config || {};
  const explicit = cfg.error_description_sensor || cfg.error_description_entity;
  if (explicit && card.hass?.states?.[explicit]) return explicit;

  const candidates = entityIdsForDevice(card, 'sensor');
  return (
    candidates.find(
      (entityId) =>
        card.hass?.entities?.[entityId]?.translation_key === 'error_description',
    ) ||
    candidates.find((entityId) => entityId.endsWith('_error_description')) ||
    null
  );
};

const localizedErrorDescription = (card, entityId, errorCode) => {
  if (!entityId) return null;
  const state = String(card.hass?.states?.[entityId]?.state ?? '').trim();
  if (!state || ['unknown', 'unavailable', 'none', 'null'].includes(state)) {
    return null;
  }
  if (state === 'no_error') return null;

  const key = `component.kress_fleet.entity.sensor.error_description.state.${state}`;
  const localized = card.hass?.localize?.(key);
  const fallback = state.replaceAll('_', ' ');
  const description = localized || fallback;

  if (state === 'unknown_error' && errorCode) {
    return `${description} (${errorCode})`;
  }
  return description;
};

const isZeroErrorState = (card, entityId) => {
  if (!entityId) return false;

  const raw = String(card.hass?.states?.[entityId]?.state ?? '').trim();

  // Kress Fleet uses numeric error code 0 for "no active error".
  return /^0+(?:\.0+)?$/.test(raw);
};

const applyErrorCompatibility = (card, errorEntityId, errorDescriptionEntityId) => {
  const root = card.shadowRoot;
  if (!root) return;

  const status = root.querySelector('.status');
  const statusText = root.querySelector('.status-text');

  if (!status || !statusText) return;

  const noError = isZeroErrorState(card, errorEntityId);

  // Do not overwrite Landroid Card's own error styling. Instead add/remove
  // one compatibility class, so a later real error immediately uses the
  // upstream red error styling again.
  let style = root.querySelector('#kress-fleet-status-compat-style');

  if (!style) {
    style = document.createElement('style');
    style.id = 'kress-fleet-status-compat-style';
    style.textContent = `
      .status.kress-fleet-no-error .status-text {
        color: var(--lc-secondary-text-color, var(--secondary-text-color)) !important;
      }
    `;
    root.appendChild(style);
  }

  status.classList.toggle('kress-fleet-no-error', noError);

  const current = String(statusText.textContent ?? '').trim();

  if (noError) {
    // Landroid Card appends the formatted error state to the status. For
    // Kress, code 0 means "no error", so remove only that trailing zero.
    const cleaned = current.replace(/\s*-\s*0+(?:\.0+)?\s*$/, '').trim();
    if (cleaned !== current) {
      statusText.textContent = cleaned;
      const title = String(status.title ?? '').trim();
      if (title) {
        status.title = title.replace(/\s*-\s*0+(?:\.0+)?\s*$/, '').trim();
      }
    }
    return;
  }

  // Keep Landroid Card's upstream red error styling, but replace a trailing
  // numeric Kress error code with the localized description supplied by the
  // integration. Older integration versions simply keep the numeric code.
  const errorCode = String(card.hass?.states?.[errorEntityId]?.state ?? '').trim();
  if (!errorCode || !/^\d+$/.test(errorCode)) return;

  const description = localizedErrorDescription(
    card,
    errorDescriptionEntityId,
    errorCode,
  );
  if (!description) return;

  const pattern = new RegExp(`\\s*-\\s*${escapeRegExp(errorCode)}\\s*$`);
  const updated = current.replace(pattern, ` - ${description}`).trim();
  if (updated !== current) {
    statusText.textContent = updated;
    const title = String(status.title ?? '').trim();
    if (title) status.title = title.replace(pattern, ` - ${description}`).trim();
  }
};

const getSavedView = (card) => {
  const cfg = card.config || {};
  if (card._kressFleetView) return card._kressFleetView;

  const configuredDefault = cfg.default_view || cfg.map_default_view;
  const defaultView = configuredDefault === 'map' ? 'map' : 'mower';
  const remember = cfg.remember_view ?? cfg.remember_map_view ?? true;
  if (!remember) return defaultView;

  try {
    const saved = localStorage.getItem(`${VIEW_KEY_PREFIX}${cfg.entity}`);
    return saved === 'map' || saved === 'mower' ? saved : defaultView;
  } catch (_err) {
    return defaultView;
  }
};

const saveView = (card, view) => {
  card._kressFleetView = view;
  const remember =
    card.config?.remember_view ?? card.config?.remember_map_view ?? true;
  if (!remember) return;

  try {
    localStorage.setItem(`${VIEW_KEY_PREFIX}${card.config.entity}`, view);
  } catch (_err) {
    // localStorage can be unavailable in hardened/private browser contexts.
  }
};

const setStyles = (element, styles) => {
  Object.assign(element.style, styles);
  return element;
};

const makeIcon = (icon) => {
  const el = document.createElement('ha-icon');
  el.setAttribute('icon', icon);
  setStyles(el, { '--mdc-icon-size': '20px' });
  return el;
};

const makeViewButton = (card, view, label, icon, active) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.view = view;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-pressed', String(active));
  setStyles(button, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '40px',
    padding: '0 14px',
    border: '0',
    borderRadius: '22px',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '15px',
    fontWeight: '600',
    color: active
      ? 'var(--text-primary-color, #fff)'
      : 'var(--primary-text-color)',
    background: active
      ? 'var(--primary-color)'
      : 'var(--secondary-background-color)',
    transition: 'background 120ms ease, color 120ms ease',
  });
  button.append(makeIcon(icon), document.createTextNode(label));
  button.addEventListener('click', () => {
    saveView(card, view);
    enhanceCard(card, true);
  });
  return button;
};

const makeCoverageSelect = (card, entityId) => {
  const state = card.hass?.states?.[entityId];
  if (!state) return null;

  const options = Array.isArray(state.attributes?.options)
    ? state.attributes.options
    : [];

  const wrapper = setStyles(document.createElement('label'), {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    flex: '1 1 235px',
    minWidth: '210px',
    marginLeft: 'auto',
    color: 'var(--secondary-text-color)',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  });

  const label = document.createElement('span');
  label.textContent = card.config?.coverage_label || tr(card.hass, 'coverage', 'Coverage');

  const select = document.createElement('select');
  select.setAttribute('aria-label', tr(card.hass, 'coverage_period', 'Coverage period'));
  setStyles(select, {
    height: '40px',
    flex: '1 1 150px',
    minWidth: '130px',
    maxWidth: '210px',
    padding: '0 34px 0 12px',
    border: '1px solid var(--divider-color)',
    borderRadius: '10px',
    color: 'var(--primary-text-color)',
    background: 'var(--card-background-color)',
    font: 'inherit',
    fontSize: '15px',
    cursor: 'pointer',
  });

  for (const option of options) {
    const optionEl = document.createElement('option');
    optionEl.value = option;
    optionEl.textContent = coverageOptionLabel(card, option);
    optionEl.selected = option === state.state;
    select.appendChild(optionEl);
  }

  select.addEventListener('change', async (event) => {
    const selected = event.target.value;
    select.disabled = true;
    try {
      await card.hass.callService('select', 'select_option', {
        entity_id: entityId,
        option: selected,
      });
    } catch (err) {
      console.error('[kress-fleet-card] Coverage change failed', err);
    } finally {
      select.disabled = false;
      card._kressFleetForceMapReload = Date.now();
      enhanceCard(card, true);
    }
  });

  wrapper.append(label, select);
  return wrapper;
};

const makeTargetZoneControls = (card, selectEntityId, buttonEntityId) => {
  const selectState = card.hass?.states?.[selectEntityId];
  const buttonState = card.hass?.states?.[buttonEntityId];
  if (!selectState || !buttonState) return null;

  const options = Array.isArray(selectState.attributes?.options)
    ? selectState.attributes.options
    : [];

  const wrapper = setStyles(document.createElement('div'), {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1 1 420px',
    minWidth: '280px',
    marginLeft: 'auto',
  });

  const label = setStyles(document.createElement('span'), {
    color: 'var(--secondary-text-color)',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  });
  label.textContent = card.config?.target_zone_label || tr(card.hass, 'target_zone', 'Mowing zone');

  const select = document.createElement('select');
  select.setAttribute('aria-label', tr(card.hass, 'target_zone', 'Mowing zone'));
  setStyles(select, {
    height: '40px',
    flex: '1 1 180px',
    minWidth: '150px',
    maxWidth: '260px',
    padding: '0 34px 0 12px',
    border: '1px solid var(--divider-color)',
    borderRadius: '10px',
    color: 'var(--primary-text-color)',
    background: 'var(--card-background-color)',
    font: 'inherit',
    fontSize: '15px',
    cursor: options.length ? 'pointer' : 'not-allowed',
  });

  const current = String(selectState.state ?? '');
  if (!current || ['unknown', 'unavailable'].includes(current)) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = tr(card.hass, 'select_zone', 'Select a zone');
    placeholder.selected = true;
    placeholder.disabled = true;
    select.appendChild(placeholder);
  }

  for (const option of options) {
    const optionEl = document.createElement('option');
    optionEl.value = option;
    optionEl.textContent = option;
    optionEl.selected = option === selectState.state;
    select.appendChild(optionEl);
  }
  select.disabled = !options.length || selectState.state === 'unavailable';

  const button = document.createElement('button');
  button.type = 'button';
  button.title = tr(card.hass, 'mow_zone', 'Mow zone');
  button.setAttribute('aria-label', tr(card.hass, 'mow_zone', 'Mow zone'));
  setStyles(button, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    minHeight: '40px',
    padding: '0 14px',
    border: '0',
    borderRadius: '20px',
    font: 'inherit',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary-color, #fff)',
    background: 'var(--primary-color)',
    cursor: 'pointer',
  });
  button.append(makeIcon('mdi:play'), document.createTextNode(tr(card.hass, 'mow_zone', 'Mow zone')));

  const updateButtonState = () => {
    const selected = String(select.value || '');
    const unavailable = String(buttonState.state || '').toLowerCase() === 'unavailable';
    button.disabled = !selected || unavailable;
    button.style.opacity = button.disabled ? '0.45' : '1';
    button.style.cursor = button.disabled ? 'not-allowed' : 'pointer';
  };
  updateButtonState();

  select.addEventListener('change', async (event) => {
    const selected = event.target.value;
    if (!selected) return;
    select.disabled = true;
    button.disabled = true;
    try {
      await card.hass.callService('select', 'select_option', {
        entity_id: selectEntityId,
        option: selected,
      });
    } catch (err) {
      console.error('[kress-fleet-card] Target zone selection failed', err);
    } finally {
      select.disabled = !options.length;
      updateButtonState();
      enhanceCard(card, true);
    }
  });

  button.addEventListener('click', async () => {
    if (button.disabled) return;
    button.disabled = true;
    try {
      await card.hass.callService('button', 'press', {
        entity_id: buttonEntityId,
      });
    } catch (err) {
      console.error('[kress-fleet-card] Targeted zone start failed', err);
    } finally {
      updateButtonState();
    }
  });

  wrapper.append(label, select, button);
  return wrapper;
};

const cameraPictureUrl = (card, cameraId) => {
  const state = card.hass?.states?.[cameraId];
  const picture = state?.attributes?.entity_picture;
  if (!picture) return null;

  const revision = [
    state.last_updated,
    state.attributes?.coverage_to,
    state.attributes?.coverage_days,
    card._kressFleetForceMapReload || '',
  ]
    .filter(Boolean)
    .join('|');

  const separator = picture.includes('?') ? '&' : '?';
  return `${picture}${separator}v=${encodeURIComponent(revision || Date.now())}`;
};

const openMoreInfo = (card, entityId) => {
  if (typeof card.handleMore === 'function') {
    card.handleMore(entityId);
    return;
  }

  card.dispatchEvent(
    new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }),
  );
};

const openZoomableMapDetail = (card, cameraId) => {
  if (card.config?.map_detail_zoom === false) {
    openMoreInfo(card, cameraId);
    return;
  }

  const url = cameraPictureUrl(card, cameraId);
  if (!url) {
    openMoreInfo(card, cameraId);
    return;
  }

  document.querySelector('.kress-fleet-map-detail')?.remove();

  const overlay = setStyles(document.createElement('div'), {
    position: 'fixed',
    inset: '0',
    zIndex: '999999',
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.92)',
    touchAction: 'none',
    userSelect: 'none',
  });
  overlay.className = 'kress-fleet-map-detail';
  overlay.tabIndex = -1;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Kress Fleet ${tr(card.hass, 'live_map', 'Live Map')}`);

  const img = document.createElement('img');
  img.alt = `Kress Fleet ${tr(card.hass, 'live_map', 'Live Map')}`;
  img.src = url;
  img.draggable = false;
  setStyles(img, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    transformOrigin: '0 0',
    willChange: 'transform',
    pointerEvents: 'none',
  });

  const hint = setStyles(document.createElement('div'), {
    position: 'absolute',
    left: '16px',
    bottom: '16px',
    zIndex: '2',
    padding: '8px 12px',
    borderRadius: '10px',
    background: 'rgba(0, 0, 0, 0.62)',
    color: '#fff',
    fontSize: '13px',
    lineHeight: '1.3',
    pointerEvents: 'none',
  });
  hint.textContent = tr(
    card.hass,
    'map_zoom_hint',
    'Mouse wheel: zoom · Drag: pan · Double-click: reset',
  );

  const toolbar = setStyles(document.createElement('div'), {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: '3',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px',
    borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.68)',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.28)',
  });

  const makeToolbarButton = (label, title) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.title = title;
    button.setAttribute('aria-label', title);
    setStyles(button, {
      minWidth: '38px',
      height: '38px',
      padding: '0 10px',
      border: '0',
      borderRadius: '9px',
      background: 'rgba(255, 255, 255, 0.14)',
      color: '#fff',
      font: 'inherit',
      fontWeight: '600',
      cursor: 'pointer',
    });
    return button;
  };

  const zoomOut = makeToolbarButton('−', 'Zoom out');
  const reset = makeToolbarButton('100%', tr(card.hass, 'map_zoom_reset', 'Reset zoom'));
  const zoomIn = makeToolbarButton('+', 'Zoom in');
  const close = makeToolbarButton('×', tr(card.hass, 'map_zoom_close', 'Close'));
  close.style.fontSize = '23px';
  toolbar.append(zoomOut, reset, zoomIn, close);

  overlay.append(img, hint, toolbar);
  document.body.appendChild(overlay);

  let baseWidth = 0;
  let baseHeight = 0;
  let scale = 1;
  let x = 0;
  let y = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;
  const minScale = 1;
  const maxScale = 8;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const constrainPan = () => {
    const viewportWidth = overlay.clientWidth;
    const viewportHeight = overlay.clientHeight;
    const scaledWidth = baseWidth * scale;
    const scaledHeight = baseHeight * scale;

    if (scaledWidth <= viewportWidth) {
      x = (viewportWidth - scaledWidth) / 2;
    } else {
      x = clamp(x, viewportWidth - scaledWidth, 0);
    }

    if (scaledHeight <= viewportHeight) {
      y = (viewportHeight - scaledHeight) / 2;
    } else {
      y = clamp(y, viewportHeight - scaledHeight, 0);
    }
  };

  const render = () => {
    if (!baseWidth || !baseHeight) return;
    constrainPan();
    img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    reset.textContent = `${Math.round(scale * 100)}%`;
    overlay.style.cursor = dragging ? 'grabbing' : scale > 1 ? 'grab' : 'zoom-in';
    zoomOut.disabled = scale <= minScale + 0.001;
    zoomIn.disabled = scale >= maxScale - 0.001;
    zoomOut.style.opacity = zoomOut.disabled ? '0.45' : '1';
    zoomIn.style.opacity = zoomIn.disabled ? '0.45' : '1';
  };

  const fit = () => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const availableWidth = Math.max(1, overlay.clientWidth * 0.96);
    const availableHeight = Math.max(1, overlay.clientHeight * 0.92);
    const fitScale = Math.min(
      availableWidth / img.naturalWidth,
      availableHeight / img.naturalHeight,
      1,
    );
    baseWidth = Math.max(1, img.naturalWidth * fitScale);
    baseHeight = Math.max(1, img.naturalHeight * fitScale);
    img.style.width = `${baseWidth}px`;
    img.style.height = `${baseHeight}px`;
    scale = 1;
    x = (overlay.clientWidth - baseWidth) / 2;
    y = (overlay.clientHeight - baseHeight) / 2;
    render();
  };

  const zoomAt = (nextScale, clientX, clientY) => {
    if (!baseWidth || !baseHeight) return;
    const bounded = clamp(nextScale, minScale, maxScale);
    if (Math.abs(bounded - scale) < 0.0001) return;

    const imageX = (clientX - x) / scale;
    const imageY = (clientY - y) / scale;
    x = clientX - imageX * bounded;
    y = clientY - imageY * bounded;
    scale = bounded;
    render();
  };

  const zoomAtCenter = (factor) => {
    zoomAt(
      scale * factor,
      overlay.clientWidth / 2,
      overlay.clientHeight / 2,
    );
  };

  const resetZoom = () => {
    scale = 1;
    x = (overlay.clientWidth - baseWidth) / 2;
    y = (overlay.clientHeight - baseHeight) / 2;
    render();
  };

  const closeDetail = () => {
    window.removeEventListener('keydown', onKeyDown, true);
    window.removeEventListener('resize', fit);
    overlay.remove();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDetail();
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoomAtCenter(1.25);
    } else if (event.key === '-') {
      event.preventDefault();
      zoomAtCenter(0.8);
    } else if (event.key === '0') {
      event.preventDefault();
      resetZoom();
    }
  };

  overlay.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      zoomAt(scale * factor, event.clientX, event.clientY);
    },
    { passive: false },
  );

  overlay.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || scale <= 1) return;
    if (toolbar.contains(event.target)) return;
    dragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragOriginX = x;
    dragOriginY = y;
    overlay.setPointerCapture?.(event.pointerId);
    render();
  });

  overlay.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    x = dragOriginX + event.clientX - dragStartX;
    y = dragOriginY + event.clientY - dragStartY;
    render();
  });

  const stopDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    overlay.releasePointerCapture?.(event.pointerId);
    render();
  };
  overlay.addEventListener('pointerup', stopDrag);
  overlay.addEventListener('pointercancel', stopDrag);

  overlay.addEventListener('dblclick', (event) => {
    if (toolbar.contains(event.target)) return;
    event.preventDefault();
    resetZoom();
  });

  zoomOut.addEventListener('click', (event) => {
    event.stopPropagation();
    zoomAtCenter(0.8);
  });
  zoomIn.addEventListener('click', (event) => {
    event.stopPropagation();
    zoomAtCenter(1.25);
  });
  reset.addEventListener('click', (event) => {
    event.stopPropagation();
    resetZoom();
  });
  close.addEventListener('click', (event) => {
    event.stopPropagation();
    closeDetail();
  });

  img.addEventListener('load', fit, { once: true });
  img.addEventListener('error', closeDetail, { once: true });
  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('resize', fit);
  overlay.focus();

  if (img.complete && img.naturalWidth) fit();
};

const makeMap = (card, cameraId) => {
  const url = cameraPictureUrl(card, cameraId);
  const container = setStyles(document.createElement('div'), {
    width: '100%',
    marginTop: '8px',
    overflow: 'hidden',
    borderRadius: '12px',
    background: 'var(--secondary-background-color)',
  });

  if (!url) {
    const message = setStyles(document.createElement('div'), {
      padding: '28px',
      textAlign: 'center',
      color: 'var(--secondary-text-color)',
    });
    message.textContent = tr(card.hass, 'live_map_unavailable', 'Live Map is not available yet');
    container.appendChild(message);
    return container;
  }

  const img = document.createElement('img');
  img.alt = `Kress Fleet ${tr(card.hass, 'live_map', 'Live Map')}`;
  img.src = url;
  img.loading = 'eager';

  const mapStyles = {
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    cursor: 'pointer',
  };
  const maxHeight = Number(card.config?.map_max_height);
  if (Number.isFinite(maxHeight) && maxHeight > 0) {
    mapStyles.maxHeight = `${maxHeight}px`;
  }

  setStyles(img, mapStyles);
  img.addEventListener('click', () => openZoomableMapDetail(card, cameraId));
  container.appendChild(img);
  return container;
};

const findOriginalMedia = (card) => {
  const root = card.shadowRoot;
  if (!root) return null;

  return (
    root.querySelector('.landroid-wrapper') ||
    root.querySelector('ha-camera-stream')?.parentElement ||
    root.querySelector('img.landroid')?.parentElement ||
    root.querySelector('img.camera')?.parentElement ||
    null
  );
};

const setMetadataVisibility = (card, visible) => {
  const metadata = card.shadowRoot?.querySelector('.metadata');
  if (metadata) metadata.style.display = visible ? '' : 'none';
};

const enhanceCard = (card, force = false) => {
  if (!card?.hass || !card.shadowRoot || card.config?.compact_view) return;

  const statusId = resolveStatusSensor(card);
  const zoneNameId = resolveZoneNameSensor(card);
  const errorId = resolveErrorSensor(card);
  const errorDescriptionId = resolveErrorDescriptionSensor(card);
  const targetZoneSelectId = resolveTargetZoneSelect(card);
  const mowSelectedZoneButtonId = resolveMowSelectedZoneButton(card);

  applyLocalizedStatus(card, statusId);
  applyZoneNameToStatus(card, zoneNameId);
  applyErrorCompatibility(card, errorId, errorDescriptionId);

  const media = findOriginalMedia(card);
  if (!media) return;

  const cameraId = resolveMapCamera(card);
  if (!cameraId) {
    setMetadataVisibility(card, true);
    media.style.display = '';
    return;
  }

  const coverageId = resolveCoverageSelect(card);
  card._kressFleetMapCameraId = cameraId;
  card._kressFleetCoverageSelectId = coverageId;

  const view = getSavedView(card);
  const currentSignature = [
    view,
    cameraId,
    coverageId,
    statusId ? card.hass.states[statusId]?.state : '',
    card.hass.states[cameraId]?.last_updated,
    coverageId ? card.hass.states[coverageId]?.state : '',
    zoneNameId ? card.hass.states[zoneNameId]?.state : '',
    errorId ? card.hass.states[errorId]?.state : '',
    errorDescriptionId ? card.hass.states[errorDescriptionId]?.state : '',
    targetZoneSelectId ? card.hass.states[targetZoneSelectId]?.state : '',
    targetZoneSelectId
      ? JSON.stringify(card.hass.states[targetZoneSelectId]?.attributes?.options || [])
      : '',
    mowSelectedZoneButtonId ? card.hass.states[mowSelectedZoneButtonId]?.state : '',
    card._kressFleetForceMapReload || '',
  ].join('|');

  let host = card.shadowRoot.querySelector('.kress-fleet-card-controls');
  if (!force && host?.dataset?.signature === currentSignature) {
    media.style.display = view === 'map' ? 'none' : '';
    setMetadataVisibility(card, view !== 'map');
    return;
  }

  if (!host) {
    host = document.createElement('div');
    host.className = 'kress-fleet-card-controls';
    media.parentNode.insertBefore(host, media);
  }

  host.dataset.signature = currentSignature;
  host.replaceChildren();
  setStyles(host, {
    display: 'block',
    boxSizing: 'border-box',
    width: '100%',
    padding: '0 12px',
  });

  const controls = setStyles(document.createElement('div'), {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    width: '100%',
    margin: '8px 0 4px',
  });

  const viewButtons = setStyles(document.createElement('div'), {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    flex: '0 0 auto',
  });

  viewButtons.append(
    makeViewButton(
      card,
      'mower',
      card.config?.mower_label || tr(card.hass, 'mower', 'Mower'),
      'mdi:robot-mower',
      view === 'mower',
    ),
    makeViewButton(
      card,
      'map',
      card.config?.map_label || tr(card.hass, 'live_map', 'Live Map'),
      'mdi:map',
      view === 'map',
    ),
  );
  controls.appendChild(viewButtons);

  if (view === 'map' && coverageId) {
    const coverage = makeCoverageSelect(card, coverageId);
    if (coverage) controls.appendChild(coverage);
  }

  if (view === 'mower' && targetZoneSelectId && mowSelectedZoneButtonId) {
    const zoneControls = makeTargetZoneControls(
      card,
      targetZoneSelectId,
      mowSelectedZoneButtonId,
    );
    if (zoneControls) controls.appendChild(zoneControls);
  }

  host.appendChild(controls);

  if (view === 'map') {
    host.appendChild(makeMap(card, cameraId));
  }

  media.style.display = view === 'map' ? 'none' : '';
  setMetadataVisibility(card, view !== 'map');
};

const normalizeGridColumns = (value) => {
  if (value === undefined || value === null || value === '' || value === 'auto') {
    return null;
  }
  if (String(value).toLowerCase() === 'full') return 'full';
  const numeric = Number(value);
  return [3, 6, 9, 12].includes(numeric) ? numeric : null;
};

class KressFleetCard extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this._inner = null;
    this._initPromise = null;
    this._enhanceTimer = null;
    this._autoModelImageCandidate = null;
    this._autoModelImageUrl = null;
    this._autoModelImageProbe = null;
  }

  setConfig(config) {
    if (!config?.entity) {
      throw new Error('Kress Fleet Card: entity is required');
    }
    this._config = { ...config };
    if (this._inner) {
      this._applyInnerConfig();
    }
    this._ensureInner();
  }

  set hass(value) {
    this._hass = value;
    if (this._inner) {
      this._inner.hass = value;
      this._syncAutomaticModelImage();
      this._scheduleEnhance();
    } else {
      this._ensureInner();
    }
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this.style.display = 'block';
    this._ensureInner();
  }

  disconnectedCallback() {
    if (this._enhanceTimer) {
      clearTimeout(this._enhanceTimer);
      this._enhanceTimer = null;
    }
  }

  getCardSize() {
    if (typeof this._inner?.getCardSize === 'function') {
      return this._inner.getCardSize();
    }
    return 6;
  }

  getGridOptions() {
    const configured = normalizeGridColumns(
      this._config?.grid_columns ?? this._config?.layout_width,
    );
    if (configured !== null) {
      return { columns: configured };
    }
    if (typeof this._inner?.getGridOptions === 'function') {
      return this._inner.getGridOptions();
    }
    return { columns: 12 };
  }

  static getStubConfig(hass) {
    const entity = Object.keys(hass?.states || {}).find((id) =>
      id.startsWith('lawn_mower.'),
    );
    return {
      entity: entity || '',
      default_view: 'mower',
      remember_view: true,
      auto_model_image: true,
      map_detail_zoom: true,
      grid_columns: 'full',
    };
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  async _ensureInner() {
    if (this._inner || this._initPromise || !this._config) return;

    this._initPromise = (async () => {
      const loading = document.createElement('ha-card');
      loading.style.padding = '16px';
      loading.style.display = 'block';
      loading.textContent = tr(this._hass, 'loading', 'Loading Kress Fleet Card …');
      this.replaceChildren(loading);

      let warned = false;
      const warningTimer = setTimeout(() => {
        warned = true;
        loading.textContent = tr(
          this._hass,
          'waiting_landroid',
          'Kress Fleet Card is waiting for “Landroid Card”. Install Landroid Card through HACS and make sure its resource is loaded.',
        );
      }, 5000);

      await customElements.whenDefined(LANDROID_TAG);
      clearTimeout(warningTimer);

      const inner = document.createElement(LANDROID_TAG);
      this._inner = inner;
      this.replaceChildren(inner);
      this._syncAutomaticModelImage();
      this._applyInnerConfig();
      if (this._hass) inner.hass = this._hass;
      this._scheduleEnhance(true);

      if (warned) {
        console.info('[kress-fleet-card] Landroid Card became available; continuing.');
      }
    })().catch((err) => {
      console.error('[kress-fleet-card] Failed to initialize', err);
      const error = document.createElement('ha-card');
      error.style.padding = '16px';
      error.textContent = `${tr(this._hass, 'load_failed', 'Kress Fleet Card could not be loaded')}: ${err?.message || err}`;
      this.replaceChildren(error);
    });

    await this._initPromise;
  }

  _automaticModelImageCandidate() {
    if (
      !this._config ||
      this._config.auto_model_image === false ||
      hasManualMowerImage(this._config)
    ) {
      return null;
    }

    const model = resolveMowerModel(this._hass, this._config.entity);
    return kressModelImageUrl(model);
  }

  _syncAutomaticModelImage() {
    const candidate = this._automaticModelImageCandidate();
    if (candidate === this._autoModelImageCandidate) return;

    if (this._autoModelImageProbe) {
      this._autoModelImageProbe.onload = null;
      this._autoModelImageProbe.onerror = null;
      this._autoModelImageProbe = null;
    }

    this._autoModelImageCandidate = candidate;
    this._autoModelImageUrl = null;

    if (!candidate || typeof Image === 'undefined') return;

    const probe = new Image();
    this._autoModelImageProbe = probe;

    probe.onload = () => {
      if (
        this._autoModelImageProbe !== probe ||
        this._automaticModelImageCandidate() !== candidate
      ) {
        return;
      }
      this._autoModelImageProbe = null;
      this._autoModelImageUrl = candidate;
      if (this._inner) this._applyInnerConfig();
    };

    probe.onerror = () => {
      if (this._autoModelImageProbe !== probe) return;
      this._autoModelImageProbe = null;
      this._autoModelImageUrl = null;
      console.info(
        `[kress-fleet-card] No remote model image available for ${candidate}; using Landroid Card fallback.`,
      );
    };

    probe.src = candidate;
  }

  _applyInnerConfig() {
    if (!this._inner || !this._config) return;

    this._syncAutomaticModelImage();

    const innerConfig = { ...this._config, type: 'custom:landroid-card' };
    delete innerConfig.grid_columns;
    delete innerConfig.layout_width;
    delete innerConfig.target_zone_select;
    delete innerConfig.target_zone_entity;
    delete innerConfig.mow_zone_button;
    delete innerConfig.mow_selected_zone_button;
    delete innerConfig.target_zone_label;
    delete innerConfig.auto_model_image;

    if (!hasManualMowerImage(this._config) && this._autoModelImageUrl) {
      innerConfig.image = this._autoModelImageUrl;
    }

    this._inner.setConfig(innerConfig);
    this._inner.config = innerConfig;
  }

  _scheduleEnhance(force = false) {
    if (!this._inner) return;
    if (this._enhanceTimer) clearTimeout(this._enhanceTimer);

    const run = () => {
      this._enhanceTimer = null;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => enhanceCard(this._inner, force));
      });
    };
    this._enhanceTimer = setTimeout(run, 0);
  }
}

class KressFleetCardEditor extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = {};
    this._rendered = false;
  }

  set hass(value) {
    const first = !this._hass;
    this._hass = value;
    if (first || !this._rendered) this._render();
  }

  get hass() {
    return this._hass;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  _emit(next) {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _update(key, value, { removeWhenEmpty = true } = {}) {
    const next = { ...this._config };
    if (
      removeWhenEmpty &&
      (value === '' || value === undefined || value === null || value === 'auto')
    ) {
      delete next[key];
    } else {
      next[key] = value;
    }
    this._emit(next);
  }

  _entityOptions(domain) {
    return Object.keys(this._hass?.states || {})
      .filter((id) => id.startsWith(`${domain}.`))
      .sort((a, b) => a.localeCompare(b));
  }

  _makeField(labelText, input) {
    const field = document.createElement('label');
    field.style.display = 'grid';
    field.style.gap = '6px';
    const label = document.createElement('span');
    label.textContent = labelText;
    label.style.fontSize = '13px';
    label.style.color = 'var(--secondary-text-color)';
    field.append(label, input);
    return field;
  }

  _makeSelect(key, values, labels = {}, allowEmpty = false) {
    const select = document.createElement('select');
    select.style.cssText =
      'height:40px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);padding:0 10px;font:inherit;';
    if (allowEmpty) {
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = tr(this._hass, 'automatic', 'Automatic');
      select.appendChild(empty);
    }
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = String(value);
      option.textContent = labels[value] ?? String(value);
      select.appendChild(option);
    });
    select.value = String(this._config[key] ?? (allowEmpty ? '' : values[0]));
    select.addEventListener('change', () => {
      const raw = select.value;
      const value = /^\d+$/.test(raw) ? Number(raw) : raw;
      this._update(key, value);
    });
    return select;
  }

  _makeEntitySelect(key, domain, required = false) {
    const select = document.createElement('select');
    select.style.cssText =
      'height:40px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);padding:0 10px;font:inherit;';
    if (!required) {
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = tr(this._hass, 'automatic', 'Automatic');
      select.appendChild(empty);
    }
    for (const entityId of this._entityOptions(domain)) {
      const option = document.createElement('option');
      option.value = entityId;
      const friendly = this._hass?.states?.[entityId]?.attributes?.friendly_name;
      option.textContent = friendly ? `${friendly} (${entityId})` : entityId;
      select.appendChild(option);
    }
    select.value = this._config[key] || '';
    select.addEventListener('change', () => this._update(key, select.value));
    return select;
  }

  _makeCheckbox(key, defaultValue) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = this._config[key] ?? defaultValue;
    input.style.width = '20px';
    input.style.height = '20px';
    input.addEventListener('change', () =>
      this._update(key, input.checked, { removeWhenEmpty: false }),
    );
    return input;
  }

  _render() {
    if (!this.isConnected || !this._hass) return;
    this._rendered = true;
    this.replaceChildren();

    const root = document.createElement('div');
    root.style.cssText = 'display:grid;gap:16px;padding:4px 0;';

    const title = document.createElement('div');
    title.textContent = 'Kress Fleet Card';
    title.style.cssText = 'font-size:18px;font-weight:600;margin-bottom:2px;';
    root.appendChild(title);

    root.appendChild(
      this._makeField(
        tr(this._hass, 'mower_entity', 'Mower entity'),
        this._makeEntitySelect('entity', 'lawn_mower', true),
      ),
    );
    root.appendChild(
      this._makeField(
        tr(this._hass, 'live_map_camera', 'Live map camera'),
        this._makeEntitySelect('map_camera', 'camera'),
      ),
    );
    root.appendChild(
      this._makeField(
        tr(this._hass, 'coverage_entity', 'Coverage period'),
        this._makeEntitySelect('coverage_select', 'select'),
      ),
    );
    root.appendChild(
      this._makeField(
        tr(this._hass, 'target_zone_entity', 'Mowing zone'),
        this._makeEntitySelect('target_zone_select', 'select'),
      ),
    );
    root.appendChild(
      this._makeField(
        tr(this._hass, 'mow_zone_button', 'Mow selected zone button'),
        this._makeEntitySelect('mow_zone_button', 'button'),
      ),
    );

    root.appendChild(
      this._makeField(
        tr(this._hass, 'default_view', 'Default view'),
        this._makeSelect(
          'default_view',
          ['mower', 'map'],
          { mower: tr(this._hass, 'mower', 'Mower'), map: tr(this._hass, 'live_map', 'Live Map') },
        ),
      ),
    );

    root.appendChild(
      this._makeField(
        tr(this._hass, 'sections_width', 'Width in Sections layout'),
        this._makeSelect(
          'grid_columns',
          ['auto', 3, 6, 9, 12, 'full'],
          {
            auto: tr(this._hass, 'width_auto', 'Automatic / Landroid Card'),
            3: tr(this._hass, 'width_3', '3 columns'),
            6: tr(this._hass, 'width_6', '6 columns'),
            9: tr(this._hass, 'width_9', '9 columns'),
            12: tr(this._hass, 'width_12', '12 columns (one Section)'),
            full: tr(this._hass, 'width_full', 'Full section-area width'),
          },
        ),
      ),
    );

    const rememberRow = document.createElement('label');
    rememberRow.style.cssText =
      'display:flex;align-items:center;gap:10px;min-height:40px;';
    rememberRow.append(
      this._makeCheckbox('remember_view', true),
      document.createTextNode(tr(this._hass, 'remember_view', 'Remember last view in this browser')),
    );
    root.appendChild(rememberRow);

    const modelImageRow = document.createElement('label');
    modelImageRow.style.cssText =
      'display:flex;align-items:center;gap:10px;min-height:40px;';
    modelImageRow.append(
      this._makeCheckbox('auto_model_image', true),
      document.createTextNode(
        tr(this._hass, 'auto_model_image', 'Automatic Kress model image'),
      ),
    );
    root.appendChild(modelImageRow);

    const zoomRow = document.createElement('label');
    zoomRow.style.cssText =
      'display:flex;align-items:center;gap:10px;min-height:40px;';
    zoomRow.append(
      this._makeCheckbox('map_detail_zoom', true),
      document.createTextNode(
        tr(this._hass, 'map_detail_zoom', 'Zoomable map detail (mouse wheel)'),
      ),
    );
    root.appendChild(zoomRow);

    const maxHeight = document.createElement('input');
    maxHeight.type = 'number';
    maxHeight.min = '0';
    maxHeight.step = '10';
    maxHeight.placeholder = tr(this._hass, 'automatic', 'Automatic');
    maxHeight.value = this._config.map_max_height ?? '';
    maxHeight.style.cssText =
      'height:40px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);padding:0 10px;font:inherit;box-sizing:border-box;';
    maxHeight.addEventListener('change', () => {
      const value = maxHeight.value ? Number(maxHeight.value) : '';
      this._update('map_max_height', value);
    });
    root.appendChild(
      this._makeField(
        tr(this._hass, 'max_map_height', 'Maximum map height (px)'),
        maxHeight,
      ),
    );

    const note = document.createElement('div');
    note.textContent = tr(
      this._hass,
      'more_options',
      'Additional Landroid Card options remain available in the YAML/code editor.',
    );
    note.style.cssText =
      'font-size:12px;line-height:1.4;color:var(--secondary-text-color);padding:10px 12px;background:var(--secondary-background-color);border-radius:8px;';
    root.appendChild(note);

    this.appendChild(root);
  }
}

if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, KressFleetCardEditor);
}

if (!customElements.get(KRESS_TAG)) {
  customElements.define(KRESS_TAG, KressFleetCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === KRESS_TAG)) {
  window.customCards.push({
    type: KRESS_TAG,
    name: 'Kress Fleet Card',
    description: tr(null, 'card_description', 'Kress mower card with switchable mower/live map, coverage period and configurable Sections width.'),
    preview: true,
    getEntitySuggestion: (_hass, entityId) =>
      entityId?.startsWith('lawn_mower.')
        ? { entity: entityId, grid_columns: 'full' }
        : null,
  });
}

console.info(
  `%c KRESS FLEET CARD %c ${KRESS_FLEET_CARD_VERSION}`,
  'color:white;background:#1f6f43;font-weight:700;padding:2px 4px;border-radius:4px 0 0 4px;',
  'color:#1f6f43;background:white;font-weight:700;padding:2px 4px;border-radius:0 4px 4px 0;',
);
