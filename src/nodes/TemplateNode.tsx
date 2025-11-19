/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

import { $applyNodeReplacement, DecoratorNode } from "lexical";
import * as React from "react";

export interface TemplatePayload {
  templateId: string;
  key?: NodeKey;
}

export type SerializedTemplateNode = Spread<
  {
    templateId: string;
  },
  SerializedLexicalNode
>;

function $convertTemplateElement(domNode: Node): null | DOMConversionOutput {
  const templateId = (domNode as HTMLElement).getAttribute("data-template-id");
  if (templateId) {
    const node = $createTemplateNode({ templateId });
    return { node };
  }
  return null;
}

export class TemplateNode extends DecoratorNode<JSX.Element> {
  __templateId: string;

  static getType(): string {
    return "template";
  }

  static clone(node: TemplateNode): TemplateNode {
    return new TemplateNode(node.__templateId, node.__key);
  }

  static importJSON(serializedNode: SerializedTemplateNode): TemplateNode {
    const node = $createTemplateNode({
      templateId: serializedNode.templateId,
    });
    return node;
  }

  exportJSON(): SerializedTemplateNode {
    return {
      templateId: this.__templateId,
      type: "template",
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-template-id")) {
          return null;
        }
        return {
          conversion: $convertTemplateElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.setAttribute("data-template-id", this.__templateId);
    return { element };
  }

  constructor(templateId: string, key?: NodeKey) {
    super(key);
    this.__templateId = templateId;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    div.className = "template-node";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getTemplateId(): string {
    return this.__templateId;
  }

  decorate(): JSX.Element {
    return (
      <TemplateComponent
        templateId={this.__templateId}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createTemplateNode({
  templateId,
  key,
}: TemplatePayload): TemplateNode {
  return $applyNodeReplacement(new TemplateNode(templateId, key));
}

export function $isTemplateNode(
  node: LexicalNode | null | undefined
): node is TemplateNode {
  return node instanceof TemplateNode;
}

// Template Component
function TemplateComponent({
  templateId,
  nodeKey,
}: {
  templateId: string;
  nodeKey: string;
}) {
  if (templateId === "contact-support") {
    return <ContactSupportTemplate />;
  }

  return <div>Template: {templateId}</div>;
}

// Contact Support Template
function ContactSupportTemplate() {
  const teamMembers = [
    {
      name: "Adre",
      role: "For the data science behind MasterMIND",
      image: "https://i.pravatar.cc/300?img=12",
    },
    {
      name: "Jennifer Liang",
      role: "For business related queries contact",
      image: "https://i.pravatar.cc/300?img=5",
    },
    {
      name: "Benjamin Ofori",
      role: "Project management and product roadmap",
      image: "https://i.pravatar.cc/300?img=33",
    },
    {
      name: "Lenart Gregolique",
      role: "Customer Support",
      image: "https://i.pravatar.cc/300?img=8",
    },
  ];

  return (
    <div className="template-contact-support">
      <div className="template-header">
        <h2>Contact our Support team</h2>
        <p className="template-subtitle">
          Welcome to the team, NCG 2025!
          <br />
          Your journey of innovation starts now.
        </p>
        <button className="template-contact-btn">Contact Us</button>
      </div>

      <div className="template-team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="template-team-card">
            <div className="template-team-image-wrapper">
              <img
                src={member.image}
                alt={member.name}
                className="template-team-image"
              />
            </div>
            <h3 className="template-team-name">{member.name}</h3>
            <p className="template-team-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
