from collections import OrderedDict, defaultdict

class LFUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.min_freq = 0
        self.map = {}                           # key → [value, freq]
        self.buckets = defaultdict(OrderedDict) # freq → keys, oldest first

    def _use(self, key, e):                     # move key to bucket freq + 1
        b = self.buckets[e[1]]
        del b[key]
        if not b and e[1] == self.min_freq:
            self.min_freq += 1
        e[1] += 1
        self.buckets[e[1]][key] = None

    def get(self, key: int) -> int:
        e = self.map.get(key)
        if e is None:
            return -1
        self._use(key, e)
        return e[0]

    def put(self, key: int, value: int) -> None:
        e = self.map.get(key)
        if e:
            e[0] = value
            self._use(key, e)
            return
        if len(self.map) == self.cap:           # evict oldest of the rarest
            old, _ = self.buckets[self.min_freq].popitem(last=False)
            del self.map[old]
        self.map[key] = [value, 1]
        self.buckets[1][key] = None
        self.min_freq = 1
