class Solution {
    vector<double> sum;
    vector<int> cnt;
    void dfs(TreeNode* n, int d) {
        if (!n) return;
        if (d == (int)sum.size()) { sum.push_back(0); cnt.push_back(0); }
        sum[d] += n->val;
        cnt[d]++;
        dfs(n->left, d + 1);
        dfs(n->right, d + 1);
    }
public:
    vector<double> averageOfLevels(TreeNode* root) {
        dfs(root, 0);
        vector<double> out;
        for (size_t d = 0; d < sum.size(); d++) out.push_back(sum[d] / cnt[d]);
        return out;
    }
};
