class Solution {
    bool path(TreeNode* node, TreeNode* target, vector<TreeNode*>& out) {   // root → target
        if (!node) return false;
        out.push_back(node);
        if (node == target || path(node->left, target, out) || path(node->right, target, out)) return true;
        out.pop_back();
        return false;
    }
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        vector<TreeNode*> a, b;
        path(root, p, a);
        path(root, q, b);
        TreeNode* lca = nullptr;
        for (size_t i = 0; i < min(a.size(), b.size()) && a[i] == b[i]; i++) lca = a[i];
        return lca;
    }
};
