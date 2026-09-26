class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        ans = []
        for x in nums1:
            i = nums2.index(x)
            ans.append(next((y for y in nums2[i + 1:] if y > x), -1))
        return ans
