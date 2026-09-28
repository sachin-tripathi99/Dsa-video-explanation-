class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.time = 0
        self.map = {}                           # key → [value, last used]

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        self.time += 1
        self.map[key][1] = self.time
        return self.map[key][0]

    def put(self, key: int, value: int) -> None:
        if key not in self.map and len(self.map) == self.cap:
            oldest = min(self.map, key=lambda k: self.map[k][1])   # O(capacity) scan
            del self.map[oldest]
        self.time += 1
        self.map[key] = [value, self.time]
