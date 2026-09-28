class TimeMap:
    def __init__(self):
        self.hist = {}                          # key → [(time, value)]

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.hist.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        for t, value in reversed(self.hist.get(key, [])):   # walk back from the newest
            if t <= timestamp:
                return value
        return ""
