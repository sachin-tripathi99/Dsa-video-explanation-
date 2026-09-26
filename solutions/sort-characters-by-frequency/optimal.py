from collections import Counter

class Solution:
    def frequencySort(self, s: str) -> str:
        bucket = [[] for _ in range(len(s) + 1)]
        for ch, c in Counter(s).items():
            bucket[c].append(ch)                # bucket[count]
        return "".join(ch * c for c in range(len(s), 0, -1) for ch in bucket[c])
