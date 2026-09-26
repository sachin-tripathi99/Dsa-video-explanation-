class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        out, path, used = [], [], [False] * len(nums)

        def go():
            if len(path) == len(nums):
                out.append(path[:])
                return
            for i, x in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(x)                  # choose
                go()                            # explore
                path.pop()                      # un-choose
                used[i] = False

        go()
        return out
