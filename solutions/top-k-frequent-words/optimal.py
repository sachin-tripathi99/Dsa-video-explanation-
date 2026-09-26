import heapq
from collections import Counter

class Word:
    """Heap entry whose ordering puts the worst candidate on top."""
    def __init__(self, w, c):
        self.w, self.c = w, c

    def __lt__(self, other):
        if self.c != other.c:
            return self.c < other.c             # lower count is worse
        return self.w > other.w                 # later alphabetically is worse

class Solution:
    def topKFrequent(self, words: List[str], k: int) -> List[str]:
        heap = []
        for w, c in Counter(words).items():
            heapq.heappush(heap, Word(w, c))
            if len(heap) > k:
                heapq.heappop(heap)
        out = []
        while heap:
            out.append(heapq.heappop(heap).w)
        return out[::-1]                        # worst → best, so reverse
