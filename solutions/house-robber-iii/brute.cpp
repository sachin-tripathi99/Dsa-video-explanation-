class Solution {
public:
    int rob(TreeNode* root) {
        if (!root) return 0;
        int take = root->val;                               // rob it: jump to grandchildren
        if (root->left) take += rob(root->left->left) + rob(root->left->right);
        if (root->right) take += rob(root->right->left) + rob(root->right->right);
        int skip = rob(root->left) + rob(root->right);      // skip it: children are free
        return max(take, skip);
    }
};
