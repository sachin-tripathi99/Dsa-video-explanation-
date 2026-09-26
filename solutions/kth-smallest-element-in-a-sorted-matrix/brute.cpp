class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        vector<int> all;
        for (auto& row : matrix) all.insert(all.end(), row.begin(), row.end());
        sort(all.begin(), all.end());
        return all[k - 1];
    }
};
