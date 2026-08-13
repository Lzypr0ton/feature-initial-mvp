# Architecture

```mermaid
flowchart LR
 UI[React/Vite dashboard] --> API[Express API]
 API --> Store[In-memory job store]
 API --> Scanner[Playwright scanner]
 Scanner --> DOM[Rendered DOM extraction]
 Scanner --> Axe[axe-core]
 Scanner --> Engine[Plugin rule engine]
 Engine --> Reports[JSON / self-contained HTML report]
```

The browser is reused, while every scan receives a fresh isolated browser context. URL validation resolves the hostname and blocks loopback, private, and link-local addresses before browser navigation.
