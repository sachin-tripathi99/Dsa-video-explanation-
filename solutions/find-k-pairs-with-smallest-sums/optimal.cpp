class Solution {
public:
    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> heap;   // (sum, i, j)
        for (int i = 0; i < min(k, (int)nums1.size()); i++) heap.push({nums1[i] + nums2[0], i, 0});   // first column
        vector<vector<int>> out;
        while ((int)out.size() < k && !heap.empty()) {
            auto [s, i, j] = heap.top(); heap.pop();
            out.push_back({nums1[i], nums2[j]});
            if (j + 1 < (int)nums2.size()) heap.push({nums1[i] + nums2[j + 1], i, j + 1});   // next in row i
        }
        return out;
    }
};
