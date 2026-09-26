from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        cnt = Counter(nums)
        return sorted(cnt, key=lambda x: -cnt[x])[:k]   # most frequent first
