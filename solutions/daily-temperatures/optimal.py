class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        ans = [0] * len(temperatures)
        st = []                                 # indices of days still waiting
        for i, x in enumerate(temperatures):
            while st and temperatures[st[-1]] < x:
                j = st.pop()
                ans[j] = i - j
            st.append(i)
        return ans
