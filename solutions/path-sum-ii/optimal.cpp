class Solution {
    vector<vector<int>> out;
    vector<int> path;
    void dfs(TreeNode* n, int remain) {
        if (!n) return;
        path.push_back(n->val);
        remain -= n->val;
        if (!n->left && !n->right && remain == 0) out.push_back(path);   // copy matches only
        dfs(n->left, remain);
        dfs(n->right, remain);
        path.pop_back();
    }
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        dfs(root, targetSum);
        return out;
    }
};
