class Solution {
    vector<long long> sums;
    void dfs(TreeNode* n, int d) {
        if (!n) return;
        if (d == (int)sums.size()) sums.push_back(0);
        sums[d] += n->val;
        dfs(n->left, d + 1);
        dfs(n->right, d + 1);
    }
public:
    int maxLevelSum(TreeNode* root) {
        dfs(root, 0);
        return max_element(sums.begin(), sums.end()) - sums.begin() + 1;   // first maximum
    }
};
