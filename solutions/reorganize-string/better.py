import heapq
from collections import Counter

class Solution:
    def reorganizeString(self, s: str) -> str:
        heap = [(-c, ch) for ch, c in Counter(s).items()]   # most copies first
        heapq.heapify(heap)
        out = []
        while heap:
            c, ch = heapq.heappop(heap)
            if out and out[-1] == ch:
                if not heap:
                    return ""                   # only the previous char is left
                c2, ch2 = heapq.heappop(heap)
                out.append(ch2)
                if c2 + 1 < 0:
                    heapq.heappush(heap, (c2 + 1, ch2))
                heapq.heappush(heap, (c, ch))
            else:
                out.append(ch)
                if c + 1 < 0:
                    heapq.heappush(heap, (c + 1, ch))
        return "".join(out)
