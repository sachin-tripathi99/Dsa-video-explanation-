class Solution {
public:
    int minDepth(TreeNode* root) {
        if (!root) return 0;
        queue<TreeNode*> q;
        q.push(root);
        for (int d = 1; ; d++) {
            for (int i = q.size(); i > 0; i--) {
                TreeNode* n = q.front(); q.pop();
                if (!n->left && !n->right) return d;        // first leaf = shallowest
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
        }
    }
};
