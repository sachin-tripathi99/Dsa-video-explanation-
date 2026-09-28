class Node:
    __slots__ = ("key", "val", "prev", "next")

    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}
        self.head, self.tail = Node(), Node()   # sentinels
        self.head.next, self.tail.prev = self.tail, self.head

    def _unlink(self, n):
        n.prev.next, n.next.prev = n.next, n.prev

    def _add_front(self, n):                    # right after head = most recent
        n.prev, n.next = self.head, self.head.next
        self.head.next.prev = n
        self.head.next = n

    def get(self, key: int) -> int:
        n = self.map.get(key)
        if n is None:
            return -1
        self._unlink(n)
        self._add_front(n)
        return n.val

    def put(self, key: int, value: int) -> None:
        n = self.map.get(key)
        if n:
            n.val = value
            self._unlink(n)
            self._add_front(n)
            return
        n = self.map[key] = Node(key, value)
        self._add_front(n)
        if len(self.map) > self.cap:            # evict least recent
            lru = self.tail.prev
            self._unlink(lru)
            del self.map[lru.key]
