from collections import Counter

class Solution:
    def frequencySort(self, s: str) -> str:
        cnt = Counter(s)
        return "".join(sorted(s, key=lambda c: (-cnt[c], c)))
