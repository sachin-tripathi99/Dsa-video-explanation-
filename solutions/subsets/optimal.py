class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        out, path = [], []

        def go(start):
            out.append(path[:])                 # every node is a subset
            for i in range(start, len(nums)):
                path.append(nums[i])            # choose
                go(i + 1)                       # explore
                path.pop()                      # un-choose

        go(0)
        return out
