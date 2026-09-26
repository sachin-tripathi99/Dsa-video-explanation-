class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        def best(l, r):
            if l == r:
                return nums[l]
            m = (l + r) // 2
            s, left = 0, float("-inf")
            for i in range(m, l - 1, -1):       # best suffix of the left half
                s += nums[i]
                left = max(left, s)
            s, right = 0, float("-inf")
            for i in range(m + 1, r + 1):       # best prefix of the right half
                s += nums[i]
                right = max(right, s)
            return max(left + right, best(l, m), best(m + 1, r))

        return best(0, len(nums) - 1)
