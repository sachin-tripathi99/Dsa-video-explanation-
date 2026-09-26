class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size(), best = 0;
        vector<int> st;                                    // indices, heights increasing
        for (int i = 0; i <= n; i++) {
            int h = i == n ? 0 : heights[i];              // sentinel flushes the stack
            while (!st.empty() && heights[st.back()] > h) {
                int t = st.back();
                st.pop_back();
                int left = st.empty() ? -1 : st.back();
                best = max(best, heights[t] * (i - left - 1));
            }
            st.push_back(i);
        }
        return best;
    }
};
