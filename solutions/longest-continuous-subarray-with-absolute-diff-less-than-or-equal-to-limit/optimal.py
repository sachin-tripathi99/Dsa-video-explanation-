from collections import deque

class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        mx, mn = deque(), deque()               # indices
        l = best = 0
        for r, x in enumerate(nums):
            while mx and nums[mx[-1]] <= x:
                mx.pop()                        # decreasing
            mx.append(r)
            while mn and nums[mn[-1]] >= x:
                mn.pop()                        # increasing
            mn.append(r)
            while nums[mx[0]] - nums[mn[0]] > limit:
                l += 1
                if mx[0] < l:
                    mx.popleft()
                if mn[0] < l:
                    mn.popleft()
            best = max(best, r - l + 1)
        return best
