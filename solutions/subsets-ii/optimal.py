class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        out, path = [], []

        def go(start):
            out.append(path[:])
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue                    # same value, same depth
                path.append(nums[i])
                go(i + 1)
                path.pop()

        go(0)
        return out
