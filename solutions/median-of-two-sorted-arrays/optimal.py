class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1         # search the smaller array
        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2
        lo, hi = 0, m
        inf = float("inf")
        while lo <= hi:
            i = (lo + hi) // 2
            j = half - i                        # i from nums1, j from nums2 on the left
            xl = nums1[i - 1] if i > 0 else -inf
            xr = nums1[i] if i < m else inf
            yl = nums2[j - 1] if j > 0 else -inf
            yr = nums2[j] if j < n else inf
            if xl <= yr and yl <= xr:
                if (m + n) % 2:
                    return float(max(xl, yl))
                return (max(xl, yl) + min(xr, yr)) / 2
            if xl > yr:
                hi = i - 1                      # took too many from nums1
            else:
                lo = i + 1                      # took too few
        raise ValueError
