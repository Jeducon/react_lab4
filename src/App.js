import { useMemo, useState } from "react"
import "./index.css"
import base from "./data/weather.json"
import Search from "./components/Search"
import WeatherCard from "./components/WeatherCard"
import WeekForecast from "./components/WeekForecast"
import FilterBar from "./components/FilterBar"
import WeatherEditor from "./components/editor/Editor"

const load = k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))

export default function App() {
  const [custom, setCustom] = useState(load("wx_custom_v1") || {})
  const all = useMemo(() => ({ ...base, ...custom }), [custom])
  const initCity = load("lastCity") || Object.keys(all)[0]
  const [city, setCity] = useState(initCity)
  const [flt, setFlt] = useState("all")
  const [edit, setEdit] = useState(false)

  const data = all[city] || null
  const list = Object.keys(all).sort()
  const pick = c => { if (all[c]) { setCity(c); save("lastCity", c) } }
  const onSave = (name, payload) => {
    if (!name?.trim()) return
    const n = name.trim()
    const next = { ...custom, [n]: payload }
    setCustom(next); save("wx_custom_v1", next); setCity(n); save("lastCity", n); setEdit(false)
  }

  const items = !data ? [] :
    (flt === "all" ? data.forecast7 : data.forecast7.filter(x => x.desc.toLowerCase().includes(flt.toLowerCase())))

  return (
    <div className="wrap">
      <h1>Weather</h1>

      <div className="controls">
        <Search onAdd={pick} />
        <button onClick={() => setEdit(true)}>Add/Edit city</button>
      </div>

      <div className="tabs">
        {list.map(c => (
          <div key={c} className={`tab ${c === city ? "active" : ""}`} onClick={() => pick(c)} style={{ cursor: "pointer" }}>{c}</div>
        ))}
      </div>

      {data && <WeatherCard city={city} data={data} />}
      <FilterBar value={flt} onChange={setFlt} />
      <WeekForecast items={items} />

      {edit && <WeatherEditor initialName={city} initialData={data} onSave={onSave} onClose={() => setEdit(false)} />}
    </div>
  )
}


