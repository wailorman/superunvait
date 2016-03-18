function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('./', true, /(test|unit|spec|int)\.js$/i));