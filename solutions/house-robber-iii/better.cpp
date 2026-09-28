class Solution {
    unordered_map<TreeNode*, int> memo;
public:
    int rob(TreeNode* root) {
        if (!root) return 0;
        auto it = memo.find(root);
        if (it != memo.end()) return it->second;            // solved before
        int take = root->val;
        if (root->left) take += rob(root->left->left) + rob(root->left->right);
        if (root->right) take += rob(root->right->left) + rob(root->right->right);
        return memo[root] = max(take, rob(root->left) + rob(root->right));
    }
};
