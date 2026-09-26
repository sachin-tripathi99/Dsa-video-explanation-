from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        bucket = [[] for _ in range(len(nums) + 1)]
        for key, c in Counter(nums).items():
            bucket[c].append(key)               # bucket[count]
        out = []
        for c in range(len(nums), 0, -1):
            for key in bucket[c]:
                if len(out) < k:
                    out.append(key)
        return out
