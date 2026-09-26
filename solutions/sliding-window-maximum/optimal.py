from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        dq, out = deque(), []                   # indices, values decreasing
        for i, x in enumerate(nums):
            if dq and dq[0] <= i - k:
                dq.popleft()                    # too old
            while dq and nums[dq[-1]] <= x:
                dq.pop()                        # useless
            dq.append(i)
            if i >= k - 1:
                out.append(nums[dq[0]])
        return out
