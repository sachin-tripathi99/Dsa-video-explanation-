class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        out, i, j = [], 0, 0
        while i < m and j < n:
            if nums1[i] <= nums2[j]:
                out.append(nums1[i]); i += 1
            else:
                out.append(nums2[j]); j += 1
        out.extend(nums1[i:m])
        out.extend(nums2[j:n])
        nums1[:] = out
