from bisect import bisect_right

class TimeMap:
    def __init__(self):
        self.times, self.values = {}, {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.times.setdefault(key, []).append(timestamp)   # stays sorted
        self.values.setdefault(key, []).append(value)

    def get(self, key: str, timestamp: int) -> str:
        ts = self.times.get(key)
        if not ts:
            return ""
        i = bisect_right(ts, timestamp) - 1     # last time ≤ timestamp
        return self.values[key][i] if i >= 0 else ""
