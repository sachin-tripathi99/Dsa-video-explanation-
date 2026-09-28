class Solution {
    TreeNode* root;
    TreeNode* find(TreeNode* n, int x) {                    // BST search for the partner
        while (n && n->val != x) n = x < n->val ? n->left : n->right;
        return n;
    }
    bool dfs(TreeNode* n, int k) {
        if (!n) return false;
        TreeNode* p = find(root, k - n->val);
        if (p && p != n) return true;
        return dfs(n->left, k) || dfs(n->right, k);
    }
public:
    bool findTarget(TreeNode* r, int k) {
        root = r;
        return dfs(r, k);
    }
};
