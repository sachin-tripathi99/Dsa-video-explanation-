import bisect

class Solution:
    def medianSlidingWindow(self, nums: List[int], k: int) -> List[float]:
        w = sorted(nums[:k])                    # window kept sorted
        out = []
        for i in range(len(nums) - k + 1):
            out.append(float(w[k // 2]) if k % 2 else (w[k // 2 - 1] + w[k // 2]) / 2)
            if i + k == len(nums):
                break
            w.pop(bisect.bisect_left(w, nums[i]))   # outgoing
            bisect.insort(w, nums[i + k])           # incoming
        return out
