class LFUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.clock = 0
        self.map = {}                           # key → [value, uses, last used]

    def get(self, key: int) -> int:
        e = self.map.get(key)
        if e is None:
            return -1
        self.clock += 1
        e[1] += 1
        e[2] = self.clock
        return e[0]

    def put(self, key: int, value: int) -> None:
        self.clock += 1
        e = self.map.get(key)
        if e:
            e[0] = value
            e[1] += 1
            e[2] = self.clock
            return
        if len(self.map) == self.cap:           # O(capacity) scan
            worst = min(self.map, key=lambda k: (self.map[k][1], self.map[k][2]))
            del self.map[worst]
        self.map[key] = [value, 1, self.clock]
