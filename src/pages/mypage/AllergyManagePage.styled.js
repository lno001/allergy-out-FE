import styled from "styled-components";

import { theme } from "../../styles/theme";

export const PageWrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: ${theme.space["3xl"]} ${theme.space.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.space["2xl"]};
`;

export const PageTitle = styled.h1`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const PageDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  line-height: ${theme.lineHeight.base};
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${theme.space.sm};
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  padding: ${theme.space.xl};
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  transition: background-color ${theme.transition.fast};

  &:hover {
    background-color: ${theme.color.bgSoft};
  }
`;

export const OptionCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  accent-color: ${theme.color.primary};
  cursor: pointer;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
