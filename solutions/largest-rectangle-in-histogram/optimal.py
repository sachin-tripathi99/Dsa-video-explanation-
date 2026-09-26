class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        st = []                                 # indices, heights increasing
        best = 0
        for i, h in enumerate(heights + [0]):   # sentinel flushes the stack
            while st and heights[st[-1]] > h:
                t = st.pop()
                left = st[-1] if st else -1
                best = max(best, heights[t] * (i - left - 1))
            st.append(i)
        return best
