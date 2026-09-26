class Solution {
    int largest(vector<int>& h) {                           // Largest Rectangle in Histogram
        int n = h.size(), best = 0;
        vector<int> st;
        for (int i = 0; i <= n; i++) {
            int x = i == n ? 0 : h[i];
            while (!st.empty() && h[st.back()] > x) {
                int t = st.back();
                st.pop_back();
                int left = st.empty() ? -1 : st.back();
                best = max(best, h[t] * (i - left - 1));
            }
            st.push_back(i);
        }
        return best;
    }
public:
    int maximalRectangle(vector<vector<char>>& matrix) {
        int n = matrix[0].size(), best = 0;
        vector<int> h(n, 0);
        for (auto& row : matrix) {
            for (int j = 0; j < n; j++) h[j] = row[j] == '1' ? h[j] + 1 : 0;   // histogram for this row
            best = max(best, largest(h));
        }
        return best;
    }
};
