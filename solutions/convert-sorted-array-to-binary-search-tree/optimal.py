class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        def build(lo, hi):
            if lo > hi:
                return None
            m = (lo + hi) // 2                  # middle of the range = root
            return TreeNode(nums[m], build(lo, m - 1), build(m + 1, hi))

        return build(0, len(nums) - 1)
