class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* n = q.front(); q.pop();
            swap(n->left, n->right);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        return root;
    }
};
