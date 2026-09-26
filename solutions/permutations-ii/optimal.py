class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        out, path, used = [], [], [False] * len(nums)

        def go():
            if len(path) == len(nums):
                out.append(path[:])
                return
            for i in range(len(nums)):
                if used[i] or (i > 0 and nums[i] == nums[i - 1] and not used[i - 1]):
                    continue                    # left copy first
                used[i] = True
                path.append(nums[i])
                go()
                path.pop()
                used[i] = False

        go()
        return out
