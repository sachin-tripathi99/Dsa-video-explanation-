class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        unordered_map<int, int> next;
        vector<int> st;                                   // values, decreasing
        for (int x : nums2) {
            while (!st.empty() && st.back() < x) { next[st.back()] = x; st.pop_back(); }
            st.push_back(x);
        }
        vector<int> ans;
        for (int x : nums1) ans.push_back(next.count(x) ? next[x] : -1);
        return ans;
    }
};
