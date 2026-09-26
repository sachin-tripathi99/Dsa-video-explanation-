class Solution:
    def medianSlidingWindow(self, nums: List[int], k: int) -> List[float]:
        out = []
        for i in range(len(nums) - k + 1):
            w = sorted(nums[i:i + k])
            out.append(float(w[k // 2]) if k % 2 else (w[k // 2 - 1] + w[k // 2]) / 2)
        return out
