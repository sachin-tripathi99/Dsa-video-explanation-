class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        return sorted(([x, y] for x in nums1 for y in nums2), key=lambda p: p[0] + p[1])[:k]
