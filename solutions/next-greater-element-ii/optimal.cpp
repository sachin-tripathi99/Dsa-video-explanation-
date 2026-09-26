class Solution {
public:
    vector<int> nextGreaterElements(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, -1), st;
        for (int i = 0; i < 2 * n; i++) {                   // two laps
            int x = nums[i % n];
            while (!st.empty() && nums[st.back()] < x) { ans[st.back()] = x; st.pop_back(); }
            if (i < n) st.push_back(i);                     // only the first lap waits
        }
        return ans;
    }
};
