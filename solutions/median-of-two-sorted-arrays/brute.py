class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        merged = sorted(nums1 + nums2)
        t = len(merged)
        return merged[t // 2] if t % 2 else (merged[t // 2 - 1] + merged[t // 2]) / 2
